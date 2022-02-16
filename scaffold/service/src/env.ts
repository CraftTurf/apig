import dotEnvExtended from 'dotenv-extended';

export default dotEnvExtended.load({
    errorOnRegex: true,
    overrideProcessEnv: true,
    errorOnExtra: true,
});
