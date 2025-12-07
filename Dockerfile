# Base ASP.NET runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0-noble AS base
WORKDIR /app
EXPOSE 8080

# Build .NET app
FROM mcr.microsoft.com/dotnet/sdk:9.0-noble AS build
WORKDIR /src
COPY ["HPCDSystem/HPCDSystem.csproj", "."]
RUN dotnet restore "./HPCDSystem.csproj"
COPY . .
RUN dotnet publish "./HPCDSystem.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Build user-client React app
FROM node:20 AS user-client-build
WORKDIR /src/user-client
COPY user-client/package*.json ./
RUN npm install
COPY user-client/ .
RUN npm run build

# Build admin-client React app
FROM node:20 AS admin-client-build
WORKDIR /src/admin-client
COPY admin-client/package*.json ./
RUN npm install
COPY admin-client/ .
RUN npm run build

# Final stage
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
COPY --from=user-client-build /src/user-client/build ./wwwroot/user
COPY --from=admin-client-build /src/admin-client/dist ./wwwroot/admin

ENTRYPOINT ["dotnet", "HPCDSystem.dll"]
