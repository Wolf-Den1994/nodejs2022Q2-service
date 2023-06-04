export const checkStart = (context) => {
  const pass = [
    'NestApplication',
    'RouterExplorer',
    'RoutesResolver',
    'InstanceLoader',
    'NestFactory',
  ];
  return pass.includes(context);
};
