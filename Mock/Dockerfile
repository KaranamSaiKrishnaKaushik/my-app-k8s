# Use .NET 9 runtime base image
FROM mcr.microsoft.com/dotnet/aspnet:9.0-preview AS base
WORKDIR /app
EXPOSE 80

# Use .NET 9 SDK image to build
FROM mcr.microsoft.com/dotnet/sdk:9.0-preview AS build
WORKDIR /src

# Copy everything into container
COPY . .

# Go into the "Mock" folder and publish the project
WORKDIR /src/Mock
RUN dotnet publish -c Release -o /app/publish

# Final image
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Mock.dll"]
