module.exports = {

  label: 'Generic Button',

  variants: [
    {
      id: 'primary',
      props: {
        classNames: ['button--primary'],
      },
      scenarios: [
        {
          label: 'English',
          context: {
            text: 'Submit this form'
          }
        },
        {
          label: 'French',
          context: {
            text: 'Envoyer ce formulaire'
          }
        }
      ]
    },
    {
      id: 'secondary',
      props: {
        classNames: ['button--secondary'],
      },
      scenarios: [
        {
          label: 'English',
          context: {
            text: 'Undo changes'
          }
        },
        {
          label: 'French',
          context: {
            text: 'Annuler les changements'
          }
        }
      ]
    },
    {
      id: 'next',
      props: {
        classNames: ['button--next'],
        next: true,
      },
      scenarios: [
        {
          label: 'English',
          context: {
            text: 'Go to the next step'
          }
        },
        {
          label: 'French',
          context: {
            text: 'Passer à l\'étape suivante'
          }
        }
      ]
    }
  ]

};
