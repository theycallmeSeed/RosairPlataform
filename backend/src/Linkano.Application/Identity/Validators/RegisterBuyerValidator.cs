using FluentValidation;
using Linkano.Application.Identity.Commands;

namespace Linkano.Application.Identity.Validators;

public sealed class RegisterBuyerValidator : AbstractValidator<RegisterBuyerCommand>
{
    public RegisterBuyerValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Email must be a valid email address.");

        RuleFor(x => x.PhoneNumber)
            .NotEmpty().WithMessage("Phone number is required.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.");

        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Full name is required.");

        RuleFor(x => x.CompanyName)
            .MaximumLength(200).When(x => x.CompanyName is not null)
            .WithMessage("Company name must not exceed 200 characters.");
    }
}