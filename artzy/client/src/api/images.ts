export function uploadImage(formData: FormData) {
    return fetch("/api/images", {
        method: "POST",
        body: formData,
    })
}