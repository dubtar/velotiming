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
        public void AddNumberAndTime_CalculatePlaceAndLaps_Pass()
        {
            DateTime start = new System.DateTime(2019, 1, 1, 1, 1, 1);

            sut.AddNumberAndTime("1", start.AddSeconds(100), "rfid");

            Assert.Single(sut.GetMarks());
            AssertResult("1", 1, 1);

            sut.AddNumberAndTime("2", start.AddSeconds(110), "rfid");
            AssertResult("2", 2, 1);
            sut.AddNumberAndTime("1", start.AddSeconds(220), "rfid");
            AssertResult("1", 1, 2);
            sut.AddNumberAndTime("2", start.AddSeconds(230), "rfid");
            AssertResult("2", 2, 2);
            sut.AddNumberAndTime("2", start.AddSeconds(330), "rfid");
            AssertResult("2", 1, 3);
            sut.AddNumberAndTime("1", start.AddSeconds(340), "rfid");
            AssertResult("1", 2, 3);
            sut.AddNumberAndTime("2", start.AddSeconds(430), "rfid");
            AssertResult("2", 1, 4);
            sut.AddNumberAndTime("2", start.AddSeconds(530), "rfid");
            AssertResult("2", 1, 5);
            sut.AddNumberAndTime("1", start.AddSeconds(540), "rfid");
            AssertResult("1", 2, 4);
        }

        [Fact]
        public void Test2()
        {
            const string s = "source";
            DateTime start = DateTime.Now.AddSeconds(-1000);
            sut.AddNumber("1", s);
            AssertResult("1", 1, 1);
            sut.AddNumber("2", s);
            AssertResult("2", 2, 1);
            sut.AddNumber("3", s);
            AssertResult("3", 3, 1);
            sut.AddTime(start.AddSeconds(100), s);
            sut.AddTime(start.AddSeconds(110), s);
            sut.AddTime(start.AddSeconds(113), s);
            AssertResult("3", 3, 1);
            sut.AddTime(start.AddSeconds(203), s);
            AssertResult("", -1, -1);
            sut.AddNumber("3", s);
            AssertResult("3", 1, 2);
            sut.AddNumber("2", s);
            sut.AddTime(start.AddSeconds(206), s);
            AssertResult("2", 2, 2);
        }

        private void AssertResult(string number, int place, int lap)
        {
            var result = sut.GetMarks().Last();
            Assert.Equal(number, result.Number);
            Assert.Equal(place, result.Place);
            Assert.Equal(lap, result.Lap);
        }
    }
}
