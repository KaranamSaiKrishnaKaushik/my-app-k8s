using GherkinHome.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Mock2;

public class Program
{
    public static WebApplication CreateHost(string[] args = null)
    {
        var builder = WebApplication.CreateBuilder(args ?? new string[0]);

        builder.Services.AddControllers();
        builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
        builder.Services.AddScoped<IMyService, MyService>();

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAll", policy =>
            {
                policy.AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });
        var app = builder.Build();
        app.UseCors("AllowAll");
        app.MapControllers();

        return app;
    }

    public static void Main(string[] args)
    {
        var app = CreateHost(args);
        app.Run();
    }

}