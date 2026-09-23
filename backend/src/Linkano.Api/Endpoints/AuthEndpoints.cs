using Linkano.Application.Identity.Commands;
using Linkano.Application.Identity.Dtos;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Linkano.Api.Endpoints;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1/auth")
            .WithTags("Authentication")
            .AllowAnonymous();

        group.MapPost("/register/buyer", RegisterBuyerAsync)
            .WithName("RegisterBuyer")
            .WithSummary("Register a new Buyer")
            .WithDescription("Self-service Buyer registration. Creates User (Role=Buyer) and BuyerProfile in a single transaction. Returns authentication tokens immediately.")
            .Produces<RegisterBuyerResponse>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status409Conflict);

        group.MapPost("/login", LoginAsync)
            .WithName("LoginBuyer")
            .WithSummary("Buyer login with email or phone and password")
            .WithDescription("Authenticates a Buyer using email or phone number and password. Returns authentication tokens.")
            .Produces<LoginBuyerResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized);

        group.MapPost("/refresh", RefreshAsync)
            .WithName("RefreshBuyer")
            .WithSummary("Refresh buyer access token")
            .WithDescription("Rotates a refresh token – revokes the presented token and issues a new access token and new refresh token.")
            .AllowAnonymous()
            .Produces<RefreshBuyerResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized);

        return app;
    }

    private static async Task<IResult> RegisterBuyerAsync(
        [FromBody] RegisterBuyerRequest request,
        ISender mediator,
        CancellationToken cancellationToken)
    {
        var command = new RegisterBuyerCommand(
            request.Email,
            request.PhoneNumber,
            request.Password,
            request.FullName,
            request.CompanyName);

        var result = await mediator.Send(command, cancellationToken);

        return Results.Created($"/api/v1/auth/register/buyer", result);
    }

    private static async Task<IResult> LoginAsync(
        [FromBody] LoginBuyerCommand request,
        ISender mediator,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(request, cancellationToken);

        return Results.Ok(result);
    }

    private static async Task<IResult> RefreshAsync(
        [FromBody] RefreshBuyerCommand request,
        ISender mediator,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(request, cancellationToken);

        return Results.Ok(result);
    }
}