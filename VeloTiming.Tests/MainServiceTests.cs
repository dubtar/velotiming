using Xunit;
using Moq;
using Microsoft.AspNetCore.SignalR;
using VeloTiming.Hubs;
using System.Threading.Tasks;
using System;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using VeloTiming.Data;

namespace VeloTiming.Tests
{
    public class MainServiceTests
    {
        MainService sut;

        public MainServiceTests()
        {
            // Mock TaskQueue to run synchronosly
            var taskQueueMock = new Mock<IBackgroundTaskQueue>();
            taskQueueMock.Setup(t => t.QueueBackgroundWorkItem(It.IsAny<Func<System.Threading.CancellationToken, Task>>()))
                .Callback<Func<System.Threading.CancellationToken, Task>>(action =>
                {
                    action(new System.Threading.CancellationToken()).Wait();
                });

            // Mock IHub
            var iHubContextMock = new Mock<IHubContext<ResultHub, IResultHub>>();
            var mockClients = new Mock<IHubClients<IResultHub>>();
            mockClients.Setup(c => c.All).Returns(Mock.Of<IResultHub>());
            iHubContextMock.Setup(h => h.Clients).Returns(() => mockClients.Object);

            // mock IServiceProvider
            var serviceProvider = new Mock<IServiceProvider>();

            var serviceScope = new Mock<IServiceScope>();
            serviceScope.Setup(x => x.ServiceProvider).Returns(serviceProvider.Object);

            var serviceScopeFactory = new Mock<IServiceScopeFactory>();
            serviceScopeFactory.Setup(x => x.CreateScope()).Returns(serviceScope.Object);

            serviceProvider
                .Setup(x => x.GetService(typeof(IServiceScopeFactory)))
                .Returns(serviceScopeFactory.Object);
            serviceProvider
                .Setup(x => x.GetService(typeof(IHubContext<ResultHub, IResultHub>)))
                .Returns(iHubContextMock.Object);
            serviceProvider
                .Setup(x => x.GetService(typeof(IBackgroundTaskQueue)))
                .Returns(taskQueueMock.Object);

            serviceProvider
                .Setup(x => x.GetService(typeof(IResultRepository)))
                .Returns(new Mock<IResultRepository>().Object);

            // create System under test
            sut = new MainService(serviceProvider.Object);

            sut.SetActiveStart(new Data.Start
            {
                Id = 12,
                Name = "Test start",
                Race = new Data.Race
                {
                    Name = "Test race"
                },
                IsActive = true,
                RealStart = new DateTime(2019, 1, 1, 1, 0, 0, 0)
            }, new System.Collections.Generic.Dictionary<string, string> {
                { "1", "Пупкин Вася"}
            }).Wait();
        }

        [Fact]
        public void Test1()
        {

            sut.AddNumberAndTime("1", new System.DateTime(2019, 1, 1, 1, 1, 1), "rfid");

            var results = sut.GetMarks().ToArray();
            Assert.Single(results);
            Assert.Equal("1", results[0].Number);
            Assert.Equal(1, results[0].Place);
            Assert.Equal(1, results[0].Lap);
        }
    }
}
