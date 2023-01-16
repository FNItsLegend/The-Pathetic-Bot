import { Config } from '../handlers/ConfigHandler.js';
import { ErrorHandler } from '../handlers/ErrorHandler.js';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
/*
Command Name: "kick"
Command Purpose: Like Ban but temporary :P
Command Options (if any): 
- User (User Object, Required)
- Reason (String Option, default: "No reason specified")
Required Permissions: BAN_MEMBERS (1 << 2)
Checks (if any): 
- Is the specified user not the same as the triggering user?
- Is the specified user not the same as the bot?
- Is the specified user not higher in roles then the triggering user?
- Is the specified user not higher in roles than the bot?
*/
export const data = new SlashCommandBuilder()
  .setName('kick') // Sets the name.
  .setDescription('Kicks the specified user.') // Sets the description.
  .setDefaultMemberPermissions(1 << 2) // Sets the required permission.
  .addUserOption((option) => {
    return option.setName('user').setDescription('The user to kick.').setRequired(true);
  })
  .addStringOption((option) => {
    return option.setName('reason').setDescription('The reason for the kick.');
  });

export async function execute(interaction: ChatInputCommandInteraction) {
  // Executes the command.
  try {
    const config = new Config(interaction.guild);
    const isEphemeral = config.getSetting('kick');
    await interaction.deferReply({
      ephemeral: isEphemeral as boolean,
    });
    // Necessary constants
    const client = interaction.client;
    const guildMembers = interaction.guild.members;
    // Funnels the provided options into variables.
    let specifiedUser = interaction.options.getUser('user');
    let reason = interaction.options.getString('reason', false);
    if (reason == null) {
      reason = 'No reason provided.'; // If the reason was empty, replace it with "No reason provided."
    }
    await guildMembers.kick(specifiedUser, reason);
    console.log(
      `The user ${interaction.user.tag} (id: ${interaction.user.id}) has successfully kicked ${specifiedUser.tag} (id: ${specifiedUser.id}) from ${interaction.guild.name} (id: ${interaction.guild.id}).`,
    );
    return interaction.editReply({
      content: `The user ${specifiedUser} has been kicked for: ${reason}`,
    });
  } catch (err) {
    const errObject = new ErrorHandler(err, 'kick');
    if (errObject.shouldExit) {
      return await interaction.editReply({
        content: errObject.message,
      });
    } else console.log(errObject.message);
  }
}
