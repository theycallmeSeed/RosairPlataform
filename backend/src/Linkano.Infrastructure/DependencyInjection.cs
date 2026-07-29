using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Linkano.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Persistence (DbContext), Identity (JWT/password hashing), Payments gateways,
        // Pricing providers, Storage, BackgroundJobs, and Logging wiring are registered
        // here as each concern is implemented.
        return services;
    }
}
