using System.Collections.Generic;
using System.Net;
using System.Net.Mime;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using Microsoft.Net.Http.Headers;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace HelloWorldWorkshop
{
  public class Function
  {
    /// <summary>
    /// Greet the user using their provided name
    /// </summary>
    /// <remarks>
    /// The API request will be in the form: GET /hello/{name}
    /// The response will be text/plain: "Hello {name}!"
    /// </remarks>
    /// <param name="request"></param>
    /// <param name="context"></param>
    /// <returns></returns>
    public APIGatewayHttpApiV2ProxyResponse FunctionHandler(
        APIGatewayHttpApiV2ProxyRequest request,
        ILambdaContext context)
    {
      var name = request.PathParameters["name"];
      return new APIGatewayHttpApiV2ProxyResponse
      {
        Headers = new Dictionary<string, string> {
            {
                HeaderNames.ContentType,
                MediaTypeNames.Text.Plain
            }
        },
        Body = $"Hello {name}!",
        StatusCode = (int)HttpStatusCode.OK
      };
    }
  }
}
