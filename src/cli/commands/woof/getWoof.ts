import { MethodArgs, ArgsOptions } from "../../args";

const woofs = {
  en: "Woof!",
  he: " בה! ",
  ru: " Гав!",
  es: "Guau!",
  cs: " Haf!",
  uk: " Гав!",
  de: "Wuff!",
  ro: " Ham!",
  cat: "Meow?"
};

export default function getWoof(args: MethodArgs): string {
  const options = args.pop() as ArgsOptions;
  let lang = "en";

  if (
    typeof options.language === "string" &&
    Object.keys(woofs).includes(options.language)
  ) {
    lang = options.language;
  }

  if (lang === "cat") {
    for (const option in options) {
      console.debug(`${option}:::`, options[option], `:::${option}`);
    }

    const envVal = options.env as string;
    if (envVal) {
      console.debug(envVal + "=" + process.env[envVal]);
    }
  }

  return woofs[lang];
}
