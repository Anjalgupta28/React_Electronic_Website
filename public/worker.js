console.log("Service Worker Loaded...");
// eslint-disable-next-line no-restricted-globals
self.addEventListener("push", e => {
    const data = e.data.json();
    // eslint-disable-next-line no-restricted-globals
    self.registration.showNotification(data.title, {
        body: "",
        icon: ""
        // http://image.ibb.co/frYOFd/tmlogo.png
        // https://i.ibb.co/85BgqwR/GT-logo.png
    })
})