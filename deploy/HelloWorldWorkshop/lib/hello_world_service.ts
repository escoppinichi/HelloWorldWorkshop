import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";

export class HelloWorldService extends cdk.Construct {
  readonly helloFunction: lambda.Function;

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    this.helloFunction = new lambda.Function(this, "HelloWorld", {
      runtime: lambda.Runtime.DOTNET_CORE_3_1,
      code: lambda.Code.fromAsset("resources/HelloWorldWorkshop.zip"),
      handler: "HelloWorldWorkshop::HelloWorldWorkshop.Function::FunctionHandler",
      logRetention: 30,
    });
  }
}