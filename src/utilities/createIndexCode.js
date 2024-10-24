import _, { chunk } from "lodash";

const safeVariableName = (fileName) => {
  const chunks = fileName.split(".");

  console.log(fileName, chunks);

  if (chunks.length <= 1) {
    return fileName;
  } else {
    return chunks.slice(0, chunks.length - 1).join(".");
  }
};

const buildExportBlock = (files) => {
  let importBlock;

  importBlock = _.map(files, (fileName) => {
    return "export * from './" + safeVariableName(fileName) + "';";
  });

  importBlock = importBlock.join("\n");

  return importBlock;
};

export default (filePaths, options = {}) => {
  let code;
  let configCode;

  code = "";
  configCode = "";

  if (options.banner) {
    const banners = _.isArray(options.banner)
      ? options.banner
      : [options.banner];

    banners.forEach((banner) => {
      code += banner + "\n";
    });

    code += "\n";
  }

  if (options.config && _.size(options.config) > 0) {
    configCode += " " + JSON.stringify(options.config);
  }

  code += "// @create-index" + configCode + "\n\n";

  if (filePaths.length) {
    const sortedFilePaths = filePaths.sort();

    code += buildExportBlock(sortedFilePaths) + "\n\n";
  }

  return code;
};
