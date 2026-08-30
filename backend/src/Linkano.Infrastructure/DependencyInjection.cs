using Linkano.Application.Common.Interfaces;
using Linkano.Infrastructure.Identity;
using Linkano.Infrastructure.Persistence;
using Linkano.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Linkano.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<LinkanoDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("LinkanoDb")));

        services.Configure<JwtOptions>(configuration.GetSection(JwtOptions.SectionName));
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

        services.AddScoped<IRefreshTokenHasher, RefreshTokenHasher>();
        services.AddScoped<IPasswordHasher, PasswordHasher>();

        services.AddScoped<IUserRepository, EfUserRepository>();
        services.AddScoped<IBuyerProfileRepository, EfBuyerProfileRepository>();
        services.AddScoped<IRefreshTokenRepository, EfRefreshTokenRepository>();
        services.AddScoped<IUnitOfWork, EfUnitOfWork>();

        // Identity (JWT/password hashing), Payments gateways, Pricing providers, Storage,
        // BackgroundJobs, and Logging wiring are registered here as each concern is implemented.
        return services;
    }
}
