using System;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using VeloTiming.Controllers;
using VeloTiming.Data;
using VeloTiming.Hubs;
using VeloTiming.Services;

namespace VeloTiming
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Production")
            //     services.AddDbContext<Data.DataContext>(options => options.UseMySQL(Configuration.GetConnectionString("MYSQLCONNSTR_localdb"))
            //         .UseLazyLoadingProxies());
            // else

            services.AddControllersWithViews();

            services.AddDbContextPool<Data.DataContext>(options =>
                options.UseSqlite(Configuration.GetConnectionString("Sqlite"))
                .UseLazyLoadingProxies()
                );

            services.AddSignalR();

            services.AddSingleton<IMainService, MainService>();
            services.AddSingleton<IRfidListener, RfidListener>();

            services.AddTransient<INumberService, NumberService>();
            services.AddTransient<ITimeService, TimeService>();
            services.AddTransient<IResultRepository, ResultRepository>();

            services.AddHostedService<QueuedHostedService>();
            services.AddSingleton<IBackgroundTaskQueue, BackgroundTaskQueue>();

            services.AddControllers()
            .AddJsonOptions(configure => 
                configure.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()))
            ;

            // Register the Swagger services
            services.AddOpenApiDocument(
                // configuration => {
                //     configuration.SerializerSettings = new Newtonsoft.Json.JsonSerializerSettings {
                //         Converters = new System.Collections.Generic.List<
                //     };
                    //configuration.DefaultEnumHandling = NJsonSchema.Generation.EnumHandling.String; };
            );

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseOpenApi();
                app.UseSwaggerUi3();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            //app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
                endpoints.MapHub<ResultHub>("/resultHub");
                endpoints.MapHub<RfidHub>("/rfidHub");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });

            // Init Singleton services
            app.ApplicationServices.GetService<IMainService>();
            app.ApplicationServices.GetService<IRfidListener>();

            // listen to websocket to /rfid
            // app.UseWebSockets().ListenRfidWebScoket();
        }

        private static IServiceProvider serviceProvider;
        internal static T GetRequiredService<T>()
        {
            return serviceProvider.GetRequiredService<T>();
        }

        internal static void SetServiceProvider(IServiceProvider serviceProvider)
        {
            Startup.serviceProvider = serviceProvider;
        }
    }
}
