// Плавная прокрутка к якорным ссылкам
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Анимация появления элементов при скролле
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Добавляем наблюдение за всеми карточками
document.querySelectorAll('.category-card, .feature-card').forEach(card => {
    observer.observe(card);
});

// Конфигурация Telegram бота
const TELEGRAM_BOT_TOKEN = '7428000904:AAHo9J52ly869iBUieGc-kihMznyUCV0JME';
const TELEGRAM_CHAT_ID = '-1002609915145';

// Функция для отправки сообщения в Telegram
async function sendToTelegram(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const params = {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
    };

    try {
        console.log('Отправка запроса:', { url, params });

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });

        const responseData = await response.json();
        console.log('Ответ от Telegram:', responseData);

        if (!response.ok) {
            throw new Error(`Ошибка отправки: ${responseData.description || 'Неизвестная ошибка'}`);
        }

        return true;
    } catch (error) {
        console.error('Ошибка:', error);
        alert(`Ошибка отправки: ${error.message}`);
        return false;
    }
}

// Обработка отправки формы
document.querySelector('.contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    alert('Форма отправляется...'); // Тестовый alert
    
    const formStatus = document.getElementById('formStatus');
    const submitButton = this.querySelector('button[type="submit"]');
    
    // Блокируем кнопку на время отправки
    submitButton.disabled = true;
    submitButton.textContent = 'Отправка...';
    
    // Собираем данные формы
    const formData = {
        name: this.querySelector('input[name="name"]').value,
        phone: this.querySelector('input[name="phone"]').value,
        email: this.querySelector('input[name="email"]').value,
        message: this.querySelector('textarea[name="message"]').value
    };
    
    // Форматируем сообщение для Telegram
    const message = `
🔔 <b>Новая заявка с сайта MARMIT</b>

👤 <b>Имя:</b> ${formData.name}
📱 <b>Телефон:</b> ${formData.phone}
📧 <b>Email:</b> ${formData.email}

💬 <b>Сообщение:</b>
${formData.message}
`;

    try {
        const success = await sendToTelegram(message);
        
        if (success) {
            formStatus.textContent = 'Спасибо! Ваше сообщение отправлено.';
            formStatus.className = 'form-status success';
            this.reset(); // Очищаем форму
        } else {
            throw new Error('Ошибка отправки');
        }
    } catch (error) {
        formStatus.textContent = 'Произошла ошибка. Пожалуйста, попробуйте позже.';
        formStatus.className = 'form-status error';
    } finally {
        // Разблокируем кнопку
        submitButton.disabled = false;
        submitButton.textContent = 'Отправить';
    }
});



// Фиксированная шапка с анимацией
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Прокрутка вниз
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Прокрутка вверх
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
});
