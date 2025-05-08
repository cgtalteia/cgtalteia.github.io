# CGT Alteia Website

A modern, responsive website template for labor unions and workers' organizations. This project provides a foundation for creating professional, accessible websites that help labor organizations connect with their members and the public.

## 🚧 Work in Progress

This project is currently under development. We're working to make it production-ready and open-source for labor organizations worldwide.

## ✨ Features

- **Modern Design**: Clean, professional interface with a focus on accessibility
- **Responsive Layout**: Fully responsive design that works on all devices
- **Interactive Elements**:
  - FAQ section with accordion functionality
  - Interactive contact form
  - AI-powered chat assistant for common questions
  - Google Maps integration
  - PDF form generation for membership applications
- **Accessibility**: Built with WCAG guidelines in mind
- **Multilingual Support**: Ready for internationalization
- **Performance Optimized**: Fast loading times and smooth interactions

## 🛠️ Technical Stack

- **Frontend**:
  - HTML5
  - CSS3 (with CSS variables for theming)
  - Vanilla JavaScript
  - Google Maps API
  - PDF-Lib for PDF generation
  - Mistral AI for chat functionality

## 📁 Project Structure

```
project/
├── index.html          # Main entry point
├── desktop.css         # Desktop styles
├── mobile.css          # Mobile styles
├── script.js           # Main JavaScript functionality
├── mistral.js          # AI chat integration
├── static/            # Static assets
│   └── adhesion.pdf   # Membership form template
└── media/             # Media files
    ├── logo.png
    ├── favicon.png
    └── poi.svg
```

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```

2. Set up your environment:
   - Get a Google Maps API key
   - Get a Mistral AI API key
   - Update the API keys in the respective files

3. Start a local server:
   ```bash
   python -m http.server 8000
   ```

4. Open `http://localhost:8000` in your browser

## 🔧 Configuration

### API Keys
- Google Maps: Update in `index.html`
- Mistral AI: Update in `mistral.js`

### Customization
- Colors and themes can be modified in `desktop.css` using CSS variables
- Content can be updated in `index.html`
- Form fields can be modified in the adhesion section

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines before submitting pull requests.

## 📝 License

This project will be released under an open-source license. Stay tuned for updates.

## 🙏 Acknowledgments

- CGT Alteia for the initial development
- All contributors who help make this project better

## 📞 Contact

For questions or support, please contact:
- Email: cgt.alteia@gmail.com
- Phone: +33 6 46 76 55 54

## 🔜 Roadmap

- [ ] Complete documentation
- [ ] Add more language support
- [ ] Create installation wizard
- [ ] Add more customization options
- [ ] Implement analytics
- [ ] Add content management system
- [ ] Create deployment guides
- [ ] Add automated testing
- [ ] Create contribution guidelines
- [ ] Set up CI/CD pipeline

---

Made with ❤️ for labor organizations worldwide
