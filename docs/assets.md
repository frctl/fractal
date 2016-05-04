<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Managing Assets](#managing-assets)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Managing Assets

**Fractal does not do any asset management, compilation or other build tasks for you.** It expects you to BYOBT (Bring Your Own Build Tool) which means you can use it just fine with Grunt, Gulp, Broccoli... whatever you like.

If you keep your component-specific assets (such as CSS/Sass/JS files etc) [alongside their respective components](/docs/components/overview.md#compound-components), then they will be displayed in the [web UI](/docs/web/overview.md) when you are browsing each component. However if you want to use those assets (or compiled versions of them) when previewing your components, you'll need to put in place some sort of build step to ensure that they end up being served out of whichever [static asset directory](/docs/project-settings.md#static-assets-path) you have configured your project to use. You can then define a [preview layout](/docs/components/layouts.md) for your components which pulls these compiled assets in.

[examples coming soon]




