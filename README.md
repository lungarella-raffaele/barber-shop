# Barber Shop Application

> Tue May 27, 2025

I started working on this project to lose all the confusion I had about creating an SSR application while exploring cool libraries and frameworks I wanted to try. This was an opportunity to explore databases, deployment, testing, and releasing too. Since I like having this project displayed as part of my CV, I want to clarify the things I would do differently in the project.

### What Went Well

I designed the site the way I wish every site worked. Registration is optional, there are no trackers, and the application only uses the necessary cookies to function. It's simple—the main page immediately gives you what you need: the reservation page. For authentication, I used simple sessions together with SvelteKit hooks to validate every request. The responsiveness of the site could be better on larger screens—the design was made with the mobile experience in mind.  
Overall, I think the application accomplishes what it was meant to do: provide a quick way to book a haircut.

### What Went Wrong

There are lots of things I would change in the application. The majority of the headaches came from unnecessary dependencies. My view on dependencies changed a lot while developing this project. In the future, I will be far more cautious about when to rely on them, since most of the time integrating a library leads to incompatible updates, overcomplicated APIs, and lots of features I’ll never need—just bloat.  
That’s not to say I’ll implement my own CSS—I’ll just be more careful in the future. There are good dependencies in the project, like [Bits UI](https://github.com/huntabyte/bits-ui), which I also learned a lot from!

The way I interact with the database could have been a lot better. I don’t really enjoy programming in JS when extensive error handling is required. I could have done better; next time, I’ll have a proper backend.  
The site needs JavaScript to work, so that's something to address in the future.

> [!IMPORTANT]  
> The application is ACTUALLY being used by Emiliano Lo Russo at **Emi Hair Club**. If you're near Siena, stop by for a cut :).

## License

This project is licensed under the [MIT license](./LICENSE).
