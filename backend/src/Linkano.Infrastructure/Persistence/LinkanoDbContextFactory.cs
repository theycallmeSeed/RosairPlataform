using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Linkano.Infrastructure.Persistence;

/// <summary>
/// Design-time-only factory used exclusively by EF Core CLI tooling (<c>dotnet ef migrations
/// add</c>, etc.) to construct <see cref="LinkanoDbContext"/>. <c>Linkano.Infrastructure</c> is
/// a class library with no host of its own to build <see cref="DbContextOptions"/> — this is
/// the standard, Microsoft-documented resolution for that scenario. It is never invoked by the
/// running application: <c>Program.cs</c> resolves <see cref="LinkanoDbContext"/> exclusively
/// through <see cref="DependencyInjection.AddInfrastructure"/>. No live connection is opened by
/// <c>migrations add</c>/<c>migrations list</c>, so this only needs to select the Npgsql
/// provider/dialect — it reads the env-var form of the same <c>ConnectionStrings:LinkanoDb</c>
/// key the app itself reads, falling back to the local placeholder already committed in
/// <c>Linkano.Api/appsettings.Development.json</c> if that variable isn't set.
/// </summary>
public sealed class LinkanoDbContextFactory : IDesignTimeDbContextFactory<LinkanoDbContext>
{
    public LinkanoDbContext CreateDbContext(string[] args)
    {
        var connectionString =
            Environment.GetEnvironmentVariable("ConnectionStrings__LinkanoDb")
            ?? "Host=localhost;Port=5432;Database=linkano_dev;Username=postgres;Password=LinkanoDev@2026";

        var optionsBuilder = new DbContextOptionsBuilder<LinkanoDbContext>();
        optionsBuilder.UseNpgsql(connectionString);

        return new LinkanoDbContext(optionsBuilder.Options);
    }
}
