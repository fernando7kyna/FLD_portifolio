document.addEventListener('DOMContentLoaded', function() {
    // Encontra ou cria o container da imagem de perfil
    const profileContainer = document.querySelector('.profile-image');
    const profileImage = document.querySelector('.profile-photo');
    
    if (!profileContainer || !profileImage) {
        console.error('Elementos de perfil não encontrados');
        return;
    }

    // Cria o botão de upload
    const uploadButton = document.createElement('label');
    uploadButton.className = 'upload-button';
    uploadButton.innerHTML = `
        <i class="fas fa-camera"></i>
        <input type="file" accept="image/*" style="display: none">
        <span class="upload-tooltip">Clique para trocar a foto</span>
    `;
    
    // Adiciona o botão ao container
    profileContainer.appendChild(uploadButton);

    // Manipula o evento de mudança de arquivo
    const fileInput = uploadButton.querySelector('input');
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (!file) return;

        // Verifica o tipo do arquivo
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione apenas arquivos de imagem.');
            return;
        }

        // Feedback visual de carregamento
        profileImage.style.opacity = '0.5';
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Atualiza a imagem
            profileImage.src = e.target.result;
            profileImage.style.opacity = '1';
            
            // Adiciona animação de atualização
            profileImage.classList.add('photo-updated');
            setTimeout(() => profileImage.classList.remove('photo-updated'), 1000);
        };

        reader.onerror = function() {
            alert('Erro ao carregar a imagem. Por favor, tente novamente.');
            profileImage.style.opacity = '1';
        };

        reader.readAsDataURL(file);
    });

    // Adiciona tooltip no hover
    uploadButton.addEventListener('mouseover', function() {
        this.querySelector('.upload-tooltip').style.opacity = '1';
    });

    uploadButton.addEventListener('mouseout', function() {
        this.querySelector('.upload-tooltip').style.opacity = '0';
    });
}); 