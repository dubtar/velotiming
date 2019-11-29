using System;
using System.Net.WebSockets;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
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
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            // if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Production")
            //     services.AddDbContext<Data.DataContext>(options => options.UseMySQL(Configuration.GetConnectionString("MYSQLCONNSTR_localdb"))
            //         .UseLazyLoadingProxies());
            // else
            services.AddDbContextPool<Data.DataContext>(options =>
                options.UseSqlite(Configuration.GetConnectionString("Sqlite"))
                .UseLazyLoadingProxies()
                );

            services.AddSignalR();

            services.AddSingleton<IMainService, MainService>();
            services.AddSingleton<IRfidListener, RfidListener>();

            services.AddTransient<INumberService, NumberService>();
            services.AddTransient<IResultRepository, ResultRepository>();

            services.AddHostedService<QueuedHostedService>();
            services.AddSingleton<IBackgroundTaskQueue, BackgroundTaskQueue>();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
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

            app.UseSignalR(routes =>
            {
                routes.MapHub<ResultHub>("/resultHub");
                routes.MapHub<RfidHub>("/rfidHub");
            });

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
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
