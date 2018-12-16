const yaml = require('yamljs');
const uuid = require('short-uuid');
const k8s = require('kubernetes-client');

const istioVirtualServiceCRD = yaml.load(__dirname + '/../../kubernetes/istio-virtual-service-crd.yaml');
const deploymentTemplate = yaml.load(__dirname + '/../../kubernetes/runner-deployment.yaml');
const serviceTemplate = yaml.load(__dirname + '/../../kubernetes/runner-service.yaml');
const virtualServiceTemplate = yaml.load(__dirname + '/../../kubernetes/runner-virtual-service.yaml');

const client = new k8s.Client({ config: k8s.config.getInCluster() });
client.addCustomResourceDefinition(istioVirtualServiceCRD);

function prepareRunnerDeployment(id) {
  const deployment = JSON.parse(JSON.stringify(deploymentTemplate));

  deployment.metadata.name += `-${id}`.toLowerCase();
  deployment.metadata.labels.runner = id;
  deployment.spec.selector.matchLabels.runner = id;
  deployment.spec.template.metadata.labels.runner = id;

  deployment.spec.template.spec.containers[0].env[0].value = `"${id}"`;

  return deployment;
}

function prepareRunnerService(id) {
  const service = JSON.parse(JSON.stringify(serviceTemplate));

  service.metadata.name += `-${id}`.toLowerCase();
  service.metadata.labels.runner = id;
  service.spec.selector.runner = id;

  return service;
}

function prepareRunnerVirtualService(id) {
  const virtualService = JSON.parse(JSON.stringify(virtualServiceTemplate));

  virtualService.metadata.name += `-${id}`.toLowerCase();
  virtualService.spec.http[0].match[0].headers.runner.exact = id;
  virtualService.spec.http[0].route[0].destination.host += `-${id}`.toLowerCase();

  return virtualService;
}

async function spawnRunner() {
  await client.loadSpec();

  const id = uuid.generate();

  const deploymentDefinition = prepareRunnerDeployment(id);
  const serviceDefinition = prepareRunnerService(id);
  const virtualServiceDefinition = prepareRunnerVirtualService(id);

  const createDeployment = client.apis.apps.v1.namespaces('fushigi').deployments.post({ body: deploymentDefinition });
  const createService = client.apis.v1.namespaces('fushigi').services.post({ body: serviceDefinition });
  const createVirtualService = client.apis['networking.istio.io'].v1alpha3.namespaces('fushigi').virtualservices.post({ body: virtualServiceDefinition });

  await Promise.all([
    createDeployment,
    createService,
    createVirtualService,
  ]);

  return id;
}

module.exports = {
  spawnRunner,
}
