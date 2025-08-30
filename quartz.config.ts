import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Supplemental Patches",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "goatcounter",
      websiteId: "supplemental-patches"
    },
    locale: "en-US",
    baseUrl: "supplemental-patches.pages.dev",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Space Mono",
        body: "Space Grotesk",
        code: "Space Mono",
      },
      colors: {
        lightMode: {
          light: "#f0f5f4",
          lightgray: "#cfdce6",
          gray: "#7a7380",
          darkgray: "#4f4b4f",
          dark: "#3a3b48",
          secondary: "#17334f",
          tertiary: "#5571a6",
          highlight: "rgba(143, 159, 169, 0.05)",
          textHighlight: "#fff23688",
        },
        darkMode: {
          light: "#100c1c",
          lightgray: "#413266",
          gray: "#6b4699",
          darkgray: "#b18fcc",
          dark: "#eadcf5",
          secondary: "#9e30f2",
          tertiary: "#7966cc",
          highlight: "rgba(143, 159, 169, 0.05)",
          textHighlight: "#b3aa0288",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
      Plugin.Carousel(),
      Plugin.ClickableImages()
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages()
    ],
  },
}

export default config
