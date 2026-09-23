using FluentValidation;
using Linkano.Application.Identity.Commands;

namespace Linkano.Application.Identity.Validators;

public sealed class RefreshBuyerValidator : AbstractValidator<RefreshBuyerCommand>
{
    public RefreshBuyerValidator()
    {
        RuleFor(x => x.RefreshToken)
            .NotEmpty().WithMessage("Refresh token is required.");
    }
}