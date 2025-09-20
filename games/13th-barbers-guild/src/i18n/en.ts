import { capFirst } from "../utils";

export const messages = {
  welcome:
    "Welcome young barber-surgeon ⚕️! This is your chance to join the <b>13th Barber's Guild</b> and work with the best!",
  instructions: `✅ Hit <em>SPACE</em> or click anywhere on the screen to continue.\n✅ Hit <em>ESC</em> at anytime to reset.\n✅ Drag potions to the cauldron when prompted.\n✅ Within ${
    import.meta.env.VITE_TIME_LIMIT
  } seconds, earn a credit for each cure!`,
  level1Callout:
    "You are on probation! The diseases are spreading across the kingdom!",
  levelNCallout: (count: number) =>
    `Diseases are worse than ever! Now you need to combine ${count} ingredients for a cure.`,
  levelParams: (count: number) => {
    const nextLevelAction =
      count === 1 ? "join our Barber's Guild" : `advance to level ${count}`;
    return `Do you believe you can earn ${
      import.meta.env.VITE_PATIENT_LIMIT
    } credits to ${nextLevelAction} within ${
      import.meta.env.VITE_TIME_LIMIT
    } seconds? Failure results in termination 🔥!`;
  },
  ingredientList: (items: string) =>
    `<h4>Pay Attention!</h4><p>Give potions according to the diseases:</p><p>${items}</p><p>Are you ready to start?</p>`,
  gameOver:
    "<h4>Game Over!</h4><p>You are a shame to our guild! Don't you dare come back here until you are really prepared!</p>",
  gameComplete:
    "<h4>Game Complete!</h4><p>Congratulations! Your name will be remembered 1300 years from now as the greatest barber-surgeon ever. Ben Kingsley will portray you in movies!</p>",
  teardownIntructions:
    "<p>Press <i>ESC</i> or hit <i>Reset</i> to restart.</p>",
  diseases: {
    flu: {
      name: "Flu",
      symptoms: "I'm feeling feverish and just hate this stuffy nose!",
      symptomsShort: "fever and runny nose",
    },
    measles: {
      name: "Measles",
      symptoms: "My body is covered in red rashes, and I'm burning up!",
      symptomsShort: "red rashes and fever",
    },
    plague: {
      name: "Plague",
      symptoms: "These swollen lumps are painful! My entire body aches!",
      symptomsShort: "swollen lumps and body pain",
    },
  },
  ingredients: [
    "Frog Tongue",
    "Salamander Tail",
    "Cat Paw",
    "Rat Tooth",
    "Hellfire Herb",
    "Badger Bone",
  ],
  health: {
    good: [
      "Help me doc!",
      "What can you do for me sir?",
      "I'm scared, help me please!",
    ],
    gettingBetter: [
      "I'm not full refresh, but I'm feeling slightly better!",
      "I think there's been a small change for the better in how I feel.",
      "I've noticed a slight improvement in my condition.",
      "I'm not as bad as I was before; there's been a minor improvement.",
      "I'm feeling a tad better, but there's still some discomfort.",
    ],
    bad: [
      "I'm not feeling better! Remember:",
      "I'm feeling worse, what did you gave me doc?",
    ],
    dead: [
      (disease: string, symptoms: string, ingredients: string) =>
        `You were supposed to save people! He only needed ${ingredients} for ${symptoms}, clear signals of ${capFirst(
          disease,
        )}.`,
      (disease: string, symptoms: string, ingredients: string) =>
        `How do you think you'd join the guild by killing your patients? ${capFirst(
          symptoms,
        )}, symptoms of ${capFirst(
          disease,
        )}, are supposed to be cured with ${ingredients}.`,
    ],
    cured: [
      "I'm feeling much better, doc! Thanks!",
      "You are a lifesaver, sir, I feel renewed!",
      "It's a miracle! I'm feeling like myself again!",
    ],
  },
};
