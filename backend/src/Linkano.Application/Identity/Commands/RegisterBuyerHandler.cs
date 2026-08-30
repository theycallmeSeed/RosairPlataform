using Linkano.Application.Common.Interfaces;
using Linkano.Application.Identity.Commands;
using Linkano.Application.Identity.Dtos;
using Linkano.Domain.Identity;
using MediatR;

namespace Linkano.Application.Identity.Commands;

public sealed class RegisterBuyerHandler
    : IRequestHandler<RegisterBuyerCommand, RegisterBuyerResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IBuyerProfileRepository _buyerProfileRepository;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IRefreshTokenHasher _refreshTokenHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IUnitOfWork _unitOfWork;

    public RegisterBuyerHandler(
        IUserRepository userRepository,
        IBuyerProfileRepository buyerProfileRepository,
        IRefreshTokenRepository refreshTokenRepository,
        IPasswordHasher passwordHasher,
        IRefreshTokenHasher refreshTokenHasher,
        IJwtTokenGenerator jwtTokenGenerator,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _buyerProfileRepository = buyerProfileRepository;
        _refreshTokenRepository = refreshTokenRepository;
        _passwordHasher = passwordHasher;
        _refreshTokenHasher = refreshTokenHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
        _unitOfWork = unitOfWork;
    }

    public async Task<RegisterBuyerResponse> Handle(
        RegisterBuyerCommand request,
        CancellationToken cancellationToken)
    {
        var existingByEmail = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
        if (existingByEmail is not null)
        {
            throw new DuplicateEmailException(request.Email);
        }

        var existingByPhone = await _userRepository.GetByPhoneNumberAsync(request.PhoneNumber, cancellationToken);
        if (existingByPhone is not null)
        {
            throw new DuplicatePhoneNumberException(request.PhoneNumber);
        }

        var passwordHash = _passwordHasher.HashPassword(request.Password);

        var user = User.Create(
            request.Email,
            request.PhoneNumber,
            passwordHash,
            UserRole.Buyer,
            request.FullName,
            UserStatus.Active,
            request.CompanyName);

        var buyerProfile = BuyerProfile.Create(user.Id, request.CompanyName);

        var tokenResult = _jwtTokenGenerator.GenerateTokens(user.Id, user.Role);

        var refreshTokenHash = _refreshTokenHasher.HashToken(tokenResult.RefreshToken);

        var refreshToken = RefreshToken.Create(
            user.Id,
            refreshTokenHash,
            tokenResult.RefreshTokenExpiresAt);

        await _userRepository.AddAsync(user, cancellationToken);
        await _buyerProfileRepository.AddAsync(buyerProfile, cancellationToken);
        await _refreshTokenRepository.AddAsync(refreshToken, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new RegisterBuyerResponse(
            tokenResult.AccessToken,
            tokenResult.RefreshToken,
            tokenResult.AccessTokenExpiresAt);
    }
}