import { SNSClient, SubscribeCommand } from "@aws-sdk/client-sns";

const sns = new SNSClient({ region: process.env.AWS_REGION });

export const subscribeEmail = async (email) => {
  const cmd = new SubscribeCommand({
    TopicArn: process.env.SNS_TOPIC_ARN,
    Protocol: "email",
    Endpoint: email
  });

  return sns.send(cmd);
};
