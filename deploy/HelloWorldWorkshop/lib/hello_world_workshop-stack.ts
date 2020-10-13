import * as cdk from "@aws-cdk/core";
import * as route53 from "@aws-cdk/aws-route53";
import * as acm from "@aws-cdk/aws-certificatemanager";
import * as hello_world_service from "./hello_world_service";
import * as hello_world_gateway from "./hello_world_gateway";

export class HelloWorldWorkshopStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const helloService = new hello_world_service.HelloWorldService(
      this,
      "HelloWorldService"
    );

    const rootDomainName = new cdk.CfnParameter(this, "RootDomainName", {
      description:
        "Fully qualified root domain name for the API (example: sandbox###.aws.headspringlabs.com)",
    });

    const hostedZoneId = new cdk.CfnParameter(this, "HostedZoneId", {
      description: "HostedZoneId to host the API",
    });

    const certificateArn = new cdk.CfnParameter(this, "CertificateArn", {
      description: "ARN for the certificate to use",
    });

    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      "HostedZone",
      {
        hostedZoneId: hostedZoneId.valueAsString,
        zoneName: rootDomainName.valueAsString,
      }
    );
    const certificate = acm.Certificate.fromCertificateArn(
      this,
      "Certificate",
      certificateArn.valueAsString
    );

    const helloApi = new hello_world_gateway.HelloWorldGateway(
      this,
      "HelloWorldGateway",
      {
        certificate: certificate,
        hostedZone: hostedZone,
        rootDomainName: rootDomainName.valueAsString,
        helloFunction: helloService.helloFunction,
      }
    );
  }
}