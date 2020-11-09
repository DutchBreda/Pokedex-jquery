var $pokemonRepository = (function () {     //IIFE starts here

    var $repository = [];  // empty array
    var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=100';

      //Delay to load in the modal; fix that with async/await to wait for all data to load from response
      async function showDetails(item) {
        await $pokemonRepository.loadDetails(item).then(function () {
        console.log(item); });
        showModal(item);
      }

      function addListItem(pokemon) {
        var $boxlist = $('.pokedex');
        var $newElement = $('<li></li>');
        var $newElementButton = $('<button></button>');
        var $newContent = $newElement.text('');
        var $newContentTwo = $newElementButton.text(pokemon.name);

        // Add Class
        $newElementButton.addClass('poko_item');

        // Append button to list
        $newElement.append($newContent);
        $newElementButton.append($newContentTwo);
        $boxlist.append($newElement);
        $newElement.append($newElementButton);

        // Show Details
        $newElementButton.on('click', function (event) {
          showDetails(pokemon);
        });
      };

    function add(pokemon) {
      $repository.push(pokemon);
      }

      function getAll() {
        return $repository;
      }

      function loadList() {
        return $.get(apiUrl,{},function (data) {
          data.results.forEach(function (item) {
            var pokemon = {
              name: item.name,
              detailsUrl: item.url
            };
            add(pokemon);
          });
        })
      }

      function loadDetails(item) {
        var url = item.detailsUrl;
        return $.get(url,{},(function (data) {
          item.imageUrl = data.sprites.front_default;
          item.height = data.height;
          item.types = Object.keys(data.types);
        }))
      }

      function showModal(item) {
        var $modalContainer = $('#modal-container');

        // Clear content in Modal
        $modalContainer.html = '';
        // Create a DOM element
        var modal = $('<div></div>');
        //Add a modal class in DOM element
        modal.addClass('modal');
        //Add class to show the modal
        $modalContainer.addClass('is-visible');

        // Close Button
        var closeButtonElement = $('<button>CLOSE</button>');
        closeButtonElement.addClass('modal-close');
        closeButtonElement.html = 'Close';

        // Close on click
        closeButtonElement.on('click', hideModal);

        var nameElement = $('<h1></h1>');
        nameElement.text = item.name.toUpperCase();

        // Create img in modal
        var imageElement = $('<img>');
        imageElement.addClass('modal-img');
        imageElement.attr("src", item.imageUrl);

        // Create element for height in modal
        var heightElement = $('<p></p>');
        heightElement.text = 'height : ' + item.height;

        // Create Type in modal
        var typesElement = $('<p></p>');
        typesElement.text = 'types : ' + item.types;

        modal.append(closeButtonElement);
        modal.append(nameElement);
        modal.append(imageElement);
        modal.append(heightElement);
        modal.append(typesElement);
        $modalContainer.append(modal);
      }

      // Modal hiding
      function hideModal() {
        var $modalContainer = $('#modal-container');
        $modalContainer.removeClass('is-visible');
      }

      // Hides modal when clicking on ESC
      window.addEventListener('keydown', (e) => {
        var $modalContainer = $('#modal-container');
        if (e.key === 'Escape' && $modalContainer.classList.contains('is-visible')) {
          hideModal();
        }
      });

      // Clicking out the modal
      var $modalContainer = document.querySelector('#modal-container');
      $modalContainer.addEventListener('click', (e) => {

        // Close when clicking on Modal
        var target = e.target;
        if (target === $modalContainer) {
          hideModal();
        }
      });

      return {
        add: add,
        getAll: getAll,
        addListItem: addListItem,
        loadList: loadList,
        loadDetails: loadDetails,
        showModal: showModal,
        hideModal: hideModal
        };

// IFFE stops here
  })();

  $pokemonRepository.loadList().then(function() {
    // Loading the data
    $pokemonRepository.getAll().forEach(function(pokemon){
      $pokemonRepository.addListItem(pokemon);
    });
  });
