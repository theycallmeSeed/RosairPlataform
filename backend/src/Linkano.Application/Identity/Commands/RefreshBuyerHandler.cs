using Linkano.Application.Common.Interfaces;
using Linkano.Application.Identity.Commands;
using Linkano.Application.Identity.Dtos;
using Linkano.Domain.Identity;
using MediatR;

namespace Linkano.Application.Identity.Commands;

public sealed class RefreshBuyerHandler
    : IRequestHandler<RefreshBuyerCommand, RefreshBuyerResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IRefreshTokenHasher _refreshTokenHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IUnitOfWork _unitOfWork;

    public RefreshBuyerHandler(
        IUserRepository userRepository,
        IRefreshTokenRepository refreshTokenRepository,
        IRefreshTokenHasher refreshTokenHasher,
        IJwtTokenGenerator jwtTokenGenerator,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _refreshTokenRepository = refreshTokenRepository;
        _refreshTokenHasher = refreshTokenHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
        _unitOfWork = unitOfWork;
    }

    public async Task<RefreshBuyerResponse> Handle(
        RefreshBuyerCommand request,
        CancellationToken cancellationToken)
    {
        string rawRefreshToken = request.RefreshToken;

        var refreshTokenHash = _refreshTokenHasher.HashToken(rawRefreshToken);

        var refreshToken = await _refreshTokenRepository.GetRefreshTokenByHashAsync(refreshTokenHash, cancellationToken);

        if (refreshToken is null)
        {
            throw new InvalidCredentialsException();
        }

        if (refreshToken.RevokedAt != null)
        {
            throw new InvalidCredentialsException();
        }

        if (refreshToken.ReplacedByTokenId != null)
        {
            throw new InvalidCredentialsException();
        }

        if (refreshToken.ExpiresAt <= DateTime.UtcNow)
        {
            throw new InvalidCredentialsException();
        }

        var user = await _userRepository.GetByIdAsync(refreshToken.UserId, cancellationToken);

        if (user is null)
        {
            throw new InvalidCredentialsException();
        }

        var tokenResult = _jwtTokenGenerator.GenerateTokens(user.Id, user.Role);

        var newRefreshTokenHash = _refreshTokenHasher.HashToken(tokenResult.RefreshToken);

        var newRefreshToken = RefreshToken.Create(refreshToken.UserId, newRefreshTokenHash, tokenResult.RefreshTokenExpiresAt);

        refreshToken.Rotate(newRefreshToken.Id);

        await _refreshTokenRepository.AddAsync(newRefreshToken, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new RefreshBuyerResponse(
            tokenResult.AccessToken,
            tokenResult.RefreshToken,
            tokenResult.AccessTokenExpiresAt);
    }
}