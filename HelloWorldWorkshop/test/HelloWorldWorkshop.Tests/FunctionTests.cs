using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using Amazon.Lambda.TestUtilities;
using Shouldly;

using HelloWorldWorkshop;

namespace HelloWorldWorkshop.Tests
{
    public class FunctionTests
    {
        public void TestHelloFunction()
        {
            var function = new Function();
            var context = new TestLambdaContext();
            var response = function.FunctionHandler(new APIGatewayHttpApiV2ProxyRequest {
                PathParameters = new Dictionary<string, string> {
                    { "name", "Francisco Escoppinichi" }
                }
            }, context);

            response.Body.ShouldBe("Hello Francisco Escoppinichi!");
            response.Headers["Content-Type"].ShouldBe("text/plain");
            response.StatusCode.ShouldBe(200);
        }
    }
}
