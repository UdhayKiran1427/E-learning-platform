let razorpayPromise = null

export function loadRazorpay() {
  if (razorpayPromise) return razorpayPromise
  razorpayPromise = new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'))
    document.body.appendChild(script)
  })
  return razorpayPromise
}

