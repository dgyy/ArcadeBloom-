import { defaultTerserOptions, js13kViteConfig } from "js13k-vite-plugins";
import { defineConfig } from "vite";

// @ts-ignore
export default defineConfig((configEnv) => {
	const terserOptions = defaultTerserOptions;
	terserOptions.mangle = {
		module: true,
		toplevel: true,
		reserved: [
			"ThirdWeb",
			"chains",
			"erc721",
			"createThirdwebClient",
			"ThirdWeb.createThirdwebClient",
			"avalanche",
			"chains.avalanche",
			"getContract",
			"ThirdWeb.getContract",
			"getNFT",
			"erc721.getNFT",
		],
	};

	const config = js13kViteConfig({
		roadrollerOptions: configEnv.mode === "development" ? false : undefined,
		terserOptions,
	});

	return config;
});
