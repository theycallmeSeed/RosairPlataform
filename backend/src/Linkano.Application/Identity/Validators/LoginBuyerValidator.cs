using FluentValidation;
using Linkano.Application.Identity.Commands;

namespace Linkano.Application.Identity.Validators;

public sealed class LoginBuyerValidator : AbstractValidator<LoginBuyerCommand>
{
    public LoginBuyerValidator()
    {
        RuleFor(x => x.EmailOrPhone)
            .NotEmpty().WithMessage("Email or phone is required.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.");
    }
}