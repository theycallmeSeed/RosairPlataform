using MediatR;

namespace Linkano.Application.Identity.Commands;

public sealed record RefreshBuyerCommand(
    string RefreshToken
) : IRequest<RefreshBuyerResponse>;