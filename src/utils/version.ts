import packageJson from "../../package.json";

export const checkVersion: () => string = () => {
  const env: string = import.meta.env.VITE_ENV ?? "";
  let version: string = `${env.toUpperCase()} - Version ${packageJson.version}`;
  switch (env) {
    case "":
    case "prod":
      version = `Version ${packageJson.version}`;
      break;
    default:
      break;
  }
  return version;
};