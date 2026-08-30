using Linkano.Application.Common.Interfaces;
using Linkano.Infrastructure.Identity;
using Linkano.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Linkano.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<LinkanoDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("LinkanoDb")));

        services.AddScoped<IRefreshTokenHasher, RefreshTokenHasher>();

        // Identity (JWT/password hashing), Payments gateways, Pricing providers, Storage,
        // BackgroundJobs, and Logging wiring are registered here as each concern is implemented.
        return services;
    }
}
