import { Packer } from 'roadroller';

export default function roadroller() {
  return {
    name: 'compress-with-roadroller',

    async generateBundle(_, bundle) {
      for (const chunk in bundle) {
        if (bundle[chunk].name === "index") {

          const inputs = [
            {
              data: bundle[chunk].code,
              type: 'js',
              action: 'eval',
            },
          ];

          const packer = new Packer(inputs, {
            maxMemoryMB: 1024,
            precision: 16,
            modelMaxCount: 5,
            modelRecipBaseCount: 20,
            recipLearningRate: 1000,
            numAbbreviations: 32,
          });
          await packer.optimize();

          const { firstLine, secondLine } = packer.makeDecoder();
          bundle[chunk].code = firstLine + secondLine;
        }
      }
    }
  }
}
