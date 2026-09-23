using Linkano.Application.Common.Interfaces;
using Linkano.Application.Identity.Commands;
using Linkano.Application.Identity.Dtos;
using Linkano.Domain.Identity;
using MediatR;

namespace Linkano.Application.Identity.Commands;

public sealed class LoginBuyerHandler
    : IRequestHandler<LoginBuyerCommand, LoginBuyerResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IRefreshTokenHasher _refreshTokenHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IUnitOfWork _unitOfWork;

    public LoginBuyerHandler(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IRefreshTokenRepository refreshTokenRepository,
        IRefreshTokenHasher refreshTokenHasher,
        IJwtTokenGenerator jwtTokenGenerator,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _refreshTokenRepository = refreshTokenRepository;
        _refreshTokenHasher = refreshTokenHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
        _unitOfWork = unitOfWork;
    }

    public async Task<LoginBuyerResponse> Handle(
        LoginBuyerCommand request,
        CancellationToken cancellationToken)
    {
        User? user = null;

        var byEmail = await _userRepository.GetByEmailAsync(request.EmailOrPhone, cancellationToken);
        if (byEmail is not null)
        {
            user = byEmail;
        }
        else
        {
            var byPhone = await _userRepository.GetByPhoneNumberAsync(request.EmailOrPhone, cancellationToken);
            if (byPhone is not null)
            {
                user = byPhone;
            }
        }

        if (user is null)
        {
            throw new InvalidCredentialsException();
        }

        if (!_passwordHasher.VerifyPassword(user.PasswordHash, request.Password))
        {
            throw new InvalidCredentialsException();
        }

        var tokenResult = _jwtTokenGenerator.GenerateTokens(user.Id, user.Role);

        var refreshTokenHash = _refreshTokenHasher.HashToken(tokenResult.RefreshToken);

        var newRefreshToken = RefreshToken.Create(user.Id, refreshTokenHash, tokenResult.RefreshTokenExpiresAt);

        await _refreshTokenRepository.AddAsync(newRefreshToken, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new LoginBuyerResponse(
            tokenResult.AccessToken,
            tokenResult.RefreshToken,
            tokenResult.AccessTokenExpiresAt);
    }
}