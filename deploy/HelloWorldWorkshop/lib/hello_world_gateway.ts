import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as api from "@aws-cdk/aws-apigatewayv2";
import * as acm from "@aws-cdk/aws-certificatemanager";
import * as route53 from "@aws-cdk/aws-route53";

export interface HelloWorldGatewayProps {
  helloFunction: lambda.Function;
  certificate: acm.ICertificate;
  hostedZone: route53.IHostedZone;
  rootDomainName: string;
}

export class HelloWorldGateway extends cdk.Construct {
  readonly apiGateway: api.HttpApi;

  constructor(scope: cdk.Construct, id: string, props: HelloWorldGatewayProps) {
    super(scope, id);

    // domain name to register with the API Gateway
    const apiDomainName = new api.DomainName(this, "ApiDomainName", {
      certificate: props.certificate,
      domainName: `helloworldworkshop.${props.rootDomainName}`,
    });

    this.apiGateway = new api.HttpApi(this, "HelloWorldApi", {
      apiName: "HelloWorldApi",
      corsPreflight: {
        allowHeaders: ["Authorization"],
        allowMethods: [api.HttpMethod.GET],
        allowOrigins: ["*"],
        maxAge: cdk.Duration.minutes(1),
      },
      // new mapping line here to use this domain by default
      defaultDomainMapping: {
        domainName: apiDomainName,
      },
    });

    const helloIntegration = new api.LambdaProxyIntegration({
      handler: props.helloFunction,
    });

    this.apiGateway.addRoutes({
      path: "/hello/{name}",
      methods: [api.HttpMethod.GET],
      integration: helloIntegration,
    });

    // DNS record to setup to point to API Gateway
    const dnsRecord = new route53.ARecord(this, "ApiAliasRecord", {
      zone: props.hostedZone,
      recordName: apiDomainName.domainName,
      target: route53.RecordTarget.fromAlias({
        bind: (record) => {
          return {
            dnsName: apiDomainName.regionalDomainName,
            hostedZoneId: apiDomainName.regionalHostedZoneId,
          };
        },
      }),
    });

    new cdk.CfnOutput(this, "ApiUrl", {
      value: `https://${apiDomainName.domainName}/`,
      description: "URL to the default stage of the API",
    });
  }
}
