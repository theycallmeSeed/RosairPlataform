using Linkano.Domain.Common;

namespace Linkano.Domain.Identity;

public sealed class InvalidCredentialsException : DomainException
{
    public InvalidCredentialsException()
        : base("Credenciais inválidas. Verifique o e-mail/telefone e a senha.")
    {
    }
}