using MediatR;

namespace Linkano.Application.Identity.Commands;

public sealed record LoginBuyerCommand(
    string EmailOrPhone,
    string Password
) : IRequest<LoginBuyerResponse>;