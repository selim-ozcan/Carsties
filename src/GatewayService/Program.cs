using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.Authority = builder.Configuration["IdentityServiceUrl"];
        o.RequireHttpsMetadata = false;
        o.TokenValidationParameters.ValidateAudience = false;
        o.TokenValidationParameters.NameClaimType = "username";
    });

builder.Services.AddCors(o => {
    o.AddPolicy("customPolicy", b => {
        b.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins(builder.Configuration["ClientApp"]);
    });
});

var app = builder.Build();

app.UseCors();
app.MapReverseProxy();
app.UseAuthentication();
app.UseAuthorization();

app.Run();
