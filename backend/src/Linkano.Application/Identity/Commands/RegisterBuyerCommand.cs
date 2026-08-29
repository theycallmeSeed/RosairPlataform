using Linkano.Domain.Identity;
using MediatR;

namespace Linkano.Application.Identity.Commands;

public sealed record RegisterBuyerCommand(
    string Email,
    string PhoneNumber,
    string Password,
    string FullName,
    string? CompanyName = null
) : IRequest<RegisterBuyerResponse>;