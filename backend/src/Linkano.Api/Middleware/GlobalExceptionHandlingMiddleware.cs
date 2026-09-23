using System.Net;
using System.Text.Json;
using Linkano.Domain.Common;
using Linkano.Domain.Identity;
using Microsoft.AspNetCore.Diagnostics;

namespace Linkano.Api.Middleware;

public sealed class GlobalExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlingMiddleware> _logger;

    public GlobalExceptionHandlingMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, title, detail, type) = MapException(exception);

        context.Response.ContentType = "application/problem+json";
        context.Response.StatusCode = statusCode;

        var problemDetails = new
        {
            type = $"https://linkano.example/errors/{type}",
            title,
            status = statusCode,
            detail,
            instance = context.Request.Path,
            traceId = context.TraceIdentifier
        };

        var json = JsonSerializer.Serialize(problemDetails);
        await context.Response.WriteAsync(json);

        _logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);
    }

    private static (int StatusCode, string Title, string Detail, string Type) MapException(Exception exception)
    {
        return exception switch
        {
            DuplicateEmailException => (
                (int)HttpStatusCode.Conflict,
                "Duplicate Email",
                exception.Message,
                "duplicate-email"),
            DuplicatePhoneNumberException => (
                (int)HttpStatusCode.Conflict,
                "Duplicate Phone Number",
                exception.Message,
                "duplicate-phone-number"),
            FluentValidation.ValidationException validationEx => (
                (int)HttpStatusCode.BadRequest,
                "Validation Failed",
                "One or more validation errors occurred.",
                "validation-failure"),
            ArgumentException => (
                (int)HttpStatusCode.BadRequest,
                "Invalid Request",
                exception.Message,
                "invalid-request"),
            InvalidOperationException => (
                (int)HttpStatusCode.InternalServerError,
                "Configuration Error",
                exception.Message,
                "configuration-error"),
            _ => (
                (int)HttpStatusCode.InternalServerError,
                "Internal Server Error",
                "An unexpected error occurred.",
                "internal-error")
        };
    }
}