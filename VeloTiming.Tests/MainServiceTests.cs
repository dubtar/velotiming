using Xunit;
using Moq;
using Microsoft.AspNetCore.SignalR;
using VeloTiming.Hubs;
using System.Threading.Tasks;
using System;
using System.Linq;

namespace VeloTiming.Tests
{
    public class MainServiceTests
    {
        MainService sut;


        public MainServiceTests()
        {
            var taskQueueMock = new Mock<IBackgroundTaskQueue>();

            taskQueueMock.Setup(t => t.QueueBackgroundWorkItem(It.IsAny<Func<System.Threading.CancellationToken, Task>>()))
                .Callback<Func<System.Threading.CancellationToken, Task>>(action =>
                {
                    action(new System.Threading.CancellationToken()).Wait();
                });

            var iHubContextMock = new Mock<IHubContext<ResultHub, IResultHub>();

            sut = new MainService(iHubContextMock.Object, taskQueueMock.Object);
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
