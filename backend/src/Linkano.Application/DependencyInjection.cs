using Microsoft.Extensions.DependencyInjection;

namespace Linkano.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Module use-case handlers, validators, and pipeline behaviors are registered here
        // as each module (Identity, Catalog, Pricing, Ordering, Payments, Communication,
        // Support, Analytics) is implemented.
        return services;
    }
}
