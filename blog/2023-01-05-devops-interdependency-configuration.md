1. Env variable
2. Resource/service lookup (az resource list --tag <tag-name>)
3. Storage/data/key vault of values
4. String-builder


azure developer cli
azure terraform  - https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs

aws cdk - https://docs.aws.amazon.com/cdk/v2/guide/best-practices.html#best-practices-organization
https://github.com/aws-samples/aws-cdk-examples 
aws terraform - https://registry.terraform.io/providers/hashicorp/aws/latest/docs


google - https://cloud.google.com/deployment-manager/docs
google terraform - https://registry.terraform.io/providers/hashicorp/google/latest/docs/guides/getting_started

best practices: 
https://developer.hashicorp.com/terraform/tutorials/recommended-patterns
https://docs.aws.amazon.com/cdk/v2/guide/best-practices.html#best-practices-organization

configuration design
https://sre.google/workbook/configuration-design/

Configuration as code 
https://www.cloudbees.com/blog/configuration-as-code-everything-need-know
https://octopus.com/blog/config-as-code-what-is-it-how-is-it-beneficial

identity as code

score - declarative, workload centric instead of infra centric
https://docs.score.dev/docs/

configuration for/by environment
configuration agnostic of environment
special cases for secrets and identity/roles