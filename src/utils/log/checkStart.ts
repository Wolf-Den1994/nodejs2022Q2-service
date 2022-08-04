export const checkStart = (context) => {
  const pass = [
    'NestApplication',
    'RouterExplorer',
    'RoutesResolver',
    'InstanceLoader',
  ];
  return pass.includes(context);
};
